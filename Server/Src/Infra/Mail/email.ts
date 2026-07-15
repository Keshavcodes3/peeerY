import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendInviteEmail = async (email: string, projectName: string, senderName: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'peerY <onboarding@resend.dev>',
            to: [email],
            subject: `You've been invited to ${projectName} on peerY`,
            html: `
        <h1>Welcome to the team!</h1>
        <p><strong>${senderName}</strong> has invited you to join the project <strong>${projectName}</strong>.</p>
        <p>Log in to peerY to accept the invitation.</p>
      `,
        });

        if (error) {
            console.error('Resend error:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Unexpected error sending email:', error);
        return { success: false, error };
    }
};

export default resend;


export const sendJoinConfirmationEmail = async (
    email: string,
    projectName: string,
    projectLink: string,
    role: string,
    teamLeadName: string
) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'peerY <onboarding@resend.dev>', // Replace with verified domain
            to: [email],
            subject: `Welcome to the ${projectName} team! 🚀`,
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937; background-color: #f9fafb; border-radius: 8px;">
          
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2563eb; font-size: 24px; margin: 0;">You're In! 🎉</h1>
            <p style="color: #4b5563; margin-top: 8px;">Welcome to the ${projectName} team</p>
          </div>

          <!-- Main Body -->
          <div style="background-color: white; padding: 24px; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
            <p style="line-height: 1.6; margin-bottom: 16px;">
              Hi there,
            </p>
            <p style="line-height: 1.6; margin-bottom: 16px;">
              Your invitation to join <strong>${projectName}</strong> has been accepted! 
              <strong>${teamLeadName}</strong> is thrilled to have you on board as a <strong>${role}</strong>.
            </p>
            
            <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Project Details:</strong><br/>
                <span style="color: #3b82f6;">${projectName}</span><br/>
                <strong>Your Role:</strong> ${role}
              </p>
            </div>

            <p style="line-height: 1.6; margin-bottom: 24px;">
              You can now access the project workspace to view tasks, collaborate with the team, and start building.
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
              <a href="${projectLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Go to Project Workspace
              </a>
            </div>
          </div>

          <!-- Footer -->
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 24px;">
            Need help? Check out our <a href="https://peery.com/docs" style="color: #3b82f6; text-decoration: none;">documentation</a> or contact support.
            <br/>
            © 2026 peerY. All rights reserved.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('[EmailService] Join Confirmation Error:', error);
            return { success: false, error };
        }

        if (!data) {
            console.warn('[EmailService] No data returned for join confirmation.');
            return { success: false, error: new Error('No response data received') };
        }

        console.log('[EmailService] Join confirmation sent:', data.id);
        return { success: true, data };

    } catch (error) {
        console.error('[EmailService] Unexpected error sending join confirmation:', error);
        return { success: false, error };
    }
};

export const sendGoogleAuthWelcomeEmail = async (
    email: string,
    userName: string,
    profileSetupLink: string,
    discoverLink: string
): Promise<any> => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'peerY <onboarding@resend.dev>',
            to: [email],
            subject: `Welcome to peerY, ${userName}! 🚀`,
            html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #1f2937; background-color: #f9fafb; border-radius: 8px;">
          
          <!-- Header with Google Branding Hint -->
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2563eb; font-size: 28px; margin: 0;">Welcome to peerY!</h1>
            <p style="color: #4b5563; margin-top: 12px; font-size: 18px;">
              Hi ${userName}, your account is ready.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 8px;">
              (Signed in with Google)
            </p>
          </div>

          <!-- Main Body -->
          <div style="background-color: white; padding: 32px; border-radius: 12px; border: 1px solid #e5e7eb; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
            <p style="line-height: 1.6; margin-bottom: 24px; font-size: 16px;">
              You've successfully joined <strong>peerY</strong>, the platform where developers discover teammates, collaborate on real projects, and ship products together.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 24px;">
              Your Google account is linked, so you're all set to log in anytime. Now, let's get your profile ready so other builders can find you!
            </p>

            <!-- Step 1: Complete Profile (Primary CTA) -->
            <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 24px; border-radius: 12px; border: 1px solid #86efac; margin: 24px 0;">
              <h3 style="color: #166534; margin: 0 0 12px 0; font-size: 18px;">🎯 Step 1: Complete Your Developer Profile</h3>
              <p style="margin: 0 0 20px 0; color: #15803d; font-size: 15px; line-height: 1.5;">
                To start matching with teammates, add your skills, tech stack, and experience. 
                <strong>Profiles with 5+ skills get 3x more visibility!</strong>
              </p>
              <div style="text-align: center;">
                <a href="${profileSetupLink}" 
                   style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(34, 197, 94, 0.2); transition: transform 0.2s;">
                  Complete My Profile
                </a>
              </div>
            </div>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 24px 0;" />

            <!-- Step 2: Discover -->
            <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 18px;">Next: Find Your Team</h3>
            <p style="line-height: 1.6; margin-bottom: 24px; color: #4b5563;">
              Ready to build? Browse the <strong>Discover Feed</strong> to find developers who match your vibe and tech stack.
            </p>

            <div style="text-align: center; margin-bottom: 16px;">
              <a href="${discoverLink}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                Start Discovering
              </a>
            </div>
          </div>

          <!-- Quick Stats / Features -->
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-top: 24px;">
            <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🧭</div>
              <div style="font-weight: 600; color: #1e40af; font-size: 14px;">Smart Match</div>
            </div>
            <div style="background-color: #f0f9ff; padding: 16px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">💬</div>
              <div style="font-weight: 600; color: #0c4a6e; font-size: 14px;">Real Chat</div>
            </div>
            <div style="background-color: #fff7ed; padding: 16px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; margin-bottom: 8px;">🚀</div>
              <div style="font-weight: 600; color: #9a3412; font-size: 14px;">Ship Fast</div>
            </div>
          </div>

          <!-- Footer -->
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-top: 32px;">
            Need help? <a href="mailto:support@peery.com" style="color: #3b82f6; text-decoration: none;">Contact Support</a>
            <br/>
            © 2026 peerY. Built with ❤️ for developers.
          </p>
        </div>
      `,
        });

        if (error) {
            console.error('[EmailService] Google Auth Welcome Email Error:', error);
            return { success: false, error };
        }

        if (!data) {
            console.warn('[EmailService] No data returned for Google Auth welcome email.');
            return { success: false, error: new Error('No response data received') };
        }

        console.log('[EmailService] Google Auth Welcome email sent:', data.id);
        return { success: true, data };

    } catch (error) {
        console.error('[EmailService] Unexpected error sending Google Auth welcome:', error);
        return { success: false, error };
    }
};