export const generateEmailTemplate = ({ budgett }: { budgett: number }) => {
  const budget =
    typeof budgett === "number" ? budgett / 100 : parseFloat(budgett) / 100;
  if (isNaN(budget)) {
    throw new Error("Invalid budget value. Please ensure it's a number.");
  }
  const serviceFee = budget * 0.05;
  const totalAmount = budget + serviceFee;

  return `
    <div
  style="font-family: 'Arial', sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #fefefe; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);">
  <!-- Logo and Header -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="https://drive.google.com/uc?id=1QWP_BnBTEYAz9IgpK3jq-nQJL8Ze4IxY"
      alt="Dinner Bell Logo" style="max-width: 120px; border-radius: 50%; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); margin-bottom: 10px;">
    <h1 style="color: #ff5722; font-size: 28px; margin: 0;">Dinner Bell</h1>
    <p style="color: #666; font-size: 14px;">Thank you for trusting us with your business!</p>
  </div>

  <!-- Receipt Details -->
  <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
    <h2 style="color: #4CAF50; font-size: 22px; margin-bottom: 15px;">Receipt</h2>
    <p style="font-size: 14px; color: #555; margin-bottom: 20px;">Here is your payment breakdown:</p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #FFEDE1; color: #444;">
          <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ff5722; font-size: 14px;">Description</th>
          <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ff5722; font-size: 14px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">Google Ads Budget</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${budget.toFixed(2)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #ddd;">Service Fee (5%)</td>
          <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd;">$${serviceFee.toFixed(2)}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td style="padding: 12px; font-weight: bold; border-top: 2px solid #ff5722; font-size: 14px;">Total</td>
          <td
            style="padding: 12px; text-align: right; font-weight: bold; color: #4CAF50; border-top: 2px solid #ff5722; font-size: 14px;">$${totalAmount.toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>
  </div>

  <!-- Footer -->
  <div style="text-align: center; margin-top: 20px;">
    <p style="color: #aaa; font-size: 12px;">For any queries, contact us at <a href="mailto:support@dinnerbell.com"
        style="color: #ff5722; text-decoration: none;">support@dinnerbell.com</a></p>
    <p style="font-size: 12px; color: #aaa;">© 2024 Dinner Bell. All rights reserved.</p>
  </div>
</div>

  `;
};
