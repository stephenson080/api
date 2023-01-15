export function getEmailTemplate(
  name: string,
  body: string,
  type: 'signup' | 'reset-email' | 'waitlist',
) {
  return `<div>
    <div style="margin: 0 auto; max-width: 300px;">
      <div style="display: flex; flex-direction: row; align-items: center;">
        <div style="height: 40px; width: 40px; border-radius: 20px;">
          <img
            src="https://res.cloudinary.com/electora/image/upload/v1673789890/blockplot_k2vxqo.png"
            alt="Bloclplot Logo"
            srcset=""
            style="width: 100%; height: 100%;"
          />
        </div>

        <h4 style="font-family: Verdana, Geneva, Tahoma, sans-serif; margin-left: 15px;">Blockplot Technologies</h4>
      </div>
    </div>
    <div style="margin: 10px 0; padding: 10px;">
      <p style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Dear, ${name}</p>
      <div style="flex-wrap: wrap; display: flex; flex-direction: row;">
          <p style="font-family: Verdana, Geneva, Tahoma, sans-serif;">${body}</p>
      </div>
    </div>
    <div style="margin: 10px 0; padding: 10px;">
      <p style="font-family: Verdana, Geneva, Tahoma, sans-serif;">Regards</p>
      <p style="font-family: Verdana, Geneva, Tahoma, sans-serif; color: #F57316;">Blockplot Support</p>
    </div>
  </div>`;
}

export const emailBody = {
  KYC: 'Thank you for completing our KYC. Please wait while we verify your Details',
  SIGNUP:
    'Welcome to Blockplot, your fractional real estate platform. your Registation was Successful',
  RESET_EMAIL: `We received a request to reset your password. Click the click below to reset password. Your code is:`,
  WAITLIST:
    'Thanks for Showing Interest in Blockplot. We shall notify you when we launch.',
};
