
# Google Maps API Setup Guide

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" and then "New Project"
4. Enter a project name (e.g., "Crop Shopping App")
5. Click "Create"

## Step 2: Enable Required APIs

1. In your Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** 
   - **Geocoding API**
   - **Directions API** (for future route functionality)

## Step 3: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. Click "Restrict Key" to secure it:
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `*.lovableproject.com/*`, `localhost:*`)
   - Under "API restrictions", select "Restrict key"
   - Choose the APIs you enabled in Step 2

## Step 4: Add API Key to Your Project

### Option 1: Environment Variable (Recommended)
1. Create a `.env.local` file in your project root
2. Add: `REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE`

### Option 2: Direct in Code (Temporary)
1. Open `src/constants/googleMaps.ts`
2. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key

## Step 5: Set Up Billing (Required)

1. In Google Cloud Console, go to "Billing"
2. Link a billing account (Google provides $200 free credits monthly)
3. Note: The app uses minimal API calls, so costs should be very low

## Important Security Notes

- Never commit API keys to version control
- Always restrict your API keys by domain and API
- Monitor usage in Google Cloud Console
- Consider using environment variables for production

## Testing the Setup

Once configured, the map should load with:
- Interactive Google Maps view
- Vendor markers (green circles)
- Search functionality
- Bottom cards for vendor details

If you encounter issues, check the browser console for error messages.
