import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sessionToken = authHeader.replace('Bearer ', '');
    
    // Verify admin session
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select(`
        admin_id,
        expires_at,
        admin_users!inner(id, email, full_name, role, is_active)
      `)
      .eq('session_token', sessionToken)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (sessionError || !session?.admin_users?.is_active) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, ...params } = await req.json();
    
    switch (action) {
      case 'getDashboardStats':
        return await getDashboardStats();
      case 'getBusinesses':
        return await getBusinesses(params);
      case 'updateBusinessStatus':
        return await updateBusinessStatus(params, session.admin_id);
      case 'getBusinessDetails':
        return await getBusinessDetails(params);
      case 'getUsers':
        return await getUsers(params);
      case 'getOrders':
        return await getOrders(params);
      case 'getSystemSettings':
        return await getSystemSettings();
      case 'updateSystemSettings':
        return await updateSystemSettings(params, session.admin_id);
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function getDashboardStats() {
  try {
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');
    
    if (error) {
      console.error('Stats error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch stats' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return new Response(
      JSON.stringify({ error: 'Stats fetch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getBusinesses({ page = 1, limit = 20, status, search }) {
  try {
    let query = supabase
      .from('seller_profiles')
      .select(`
        *,
        profiles!inner(full_name, email, phone_number, created_at)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('verification_status', status);
    }

    if (search) {
      query = query.or(`business_name.ilike.%${search}%, business_description.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .range(from, to)
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Businesses fetch error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch businesses' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get businesses error:', error);
    return new Response(
      JSON.stringify({ error: 'Businesses fetch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function updateBusinessStatus({ sellerId, status, notes }, adminId: string) {
  try {
    // Get current status
    const { data: currentSeller, error: fetchError } = await supabase
      .from('seller_profiles')
      .select('verification_status')
      .eq('id', sellerId)
      .single();

    if (fetchError) {
      return new Response(
        JSON.stringify({ error: 'Seller not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update seller status
    const { error: updateError } = await supabase
      .from('seller_profiles')
      .update({ verification_status: status })
      .eq('id', sellerId);

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Status update failed' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the verification action
    await supabase
      .from('business_verification_logs')
      .insert({
        seller_profile_id: sellerId,
        admin_id: adminId,
        action: status,
        notes,
        previous_status: currentSeller.verification_status,
        new_status: status
      });

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update business status error:', error);
    return new Response(
      JSON.stringify({ error: 'Status update failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getBusinessDetails({ sellerId }) {
  try {
    const { data, error } = await supabase.rpc('get_seller_verification_details', {
      _seller_id: sellerId
    });

    if (error) {
      console.error('Business details error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch business details' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get business details error:', error);
    return new Response(
      JSON.stringify({ error: 'Business details fetch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getUsers({ page = 1, limit = 20, userType, search }) {
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (userType) {
      query = query.eq('user_type', userType);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%, email.ilike.%${search}%`);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .range(from, to)
      .select('*', { count: 'exact' });

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get users error:', error);
    return new Response(
      JSON.stringify({ error: 'Users fetch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getOrders({ page = 1, limit = 20, status, search }) {
  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        profiles!buyer_id(full_name, email),
        seller_profiles!seller_id(business_name)
      `)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    const { data, error, count } = await query
      .range(from, to)
      .select('*', { count: 'exact' });

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch orders' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get orders error:', error);
    return new Response(
      JSON.stringify({ error: 'Orders fetch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function getSystemSettings() {
  try {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key');

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch settings' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Get system settings error:', error);
    return new Response(
      JSON.stringify({ error: 'Settings fetch failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

async function updateSystemSettings({ settings }, adminId: string) {
  try {
    for (const setting of settings) {
      await supabase
        .from('system_settings')
        .upsert({
          setting_key: setting.key,
          setting_value: setting.value,
          description: setting.description,
          updated_by: adminId
        });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Update system settings error:', error);
    return new Response(
      JSON.stringify({ error: 'Settings update failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}