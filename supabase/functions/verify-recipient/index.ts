
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VerificationRequest {
  giftToken: string;
  phoneNumber: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { giftToken, phoneNumber } = await req.json() as VerificationRequest;

    // Get gift details
    const { data: gift, error: giftError } = await supabaseClient
      .from('gifts')
      .select('*')
      .eq('token', giftToken)
      .single();

    if (giftError || !gift) {
      throw new Error('Gift not found');
    }

    // Generate verification code
    const verificationCode = Math.random().toString().slice(2, 8);
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Code expires in 10 minutes

    // Store verification attempt
    const { error: verificationError } = await supabaseClient
      .from('recipient_verifications')
      .insert({
        gift_id: gift.id,
        phone_number: phoneNumber,
        verification_code: verificationCode,
        expires_at: expiresAt.toISOString(),
      });

    if (verificationError) {
      throw verificationError;
    }

    // In a production environment, you would send an SMS here
    // For development, we'll just return the code
    return new Response(
      JSON.stringify({ 
        message: 'Verification code sent',
        code: verificationCode // Remove this in production
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
