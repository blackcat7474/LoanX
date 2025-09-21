
import { GoogleGenAI } from "@google/genai";
import { Loan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const getRepaymentAdvice = async (loan: Loan, extraPayment: number, standardMonthlyPayment: number): Promise<string> => {
  if (extraPayment <= 0) {
    return "Please enter a positive extra payment amount to get advice.";
  }

  const prompt = `
Analyze the impact of making an extra monthly payment on a loan.

**Loan Details:**
- Principal: ₹${loan.principal.toLocaleString('en-IN')}
- Annual Interest Rate: ${loan.interestRate}%
- Term: ${loan.term} months
- Standard Monthly Payment: ₹${standardMonthlyPayment.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

**Proposed Change:**
- Extra Monthly Payment: ₹${extraPayment.toLocaleString('en-IN')}
- New Total Monthly Payment: ₹${(standardMonthlyPayment + extraPayment).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}

Please provide a concise and encouraging analysis for a borrower. Structure your response as follows:

1.  **Interest Savings:** Boldly state the total interest saved and how significant this is.
2.  **Early Payoff:** State clearly how many months or years sooner the loan will be paid off.
3.  **Key Benefits Summary:** Provide 2-3 bullet points summarizing the main advantages of this strategy (e.g., "Build equity faster," "Free up cash flow sooner," "Achieve financial freedom earlier").
4.  **Concluding Remark:** End with a short, motivational sentence to encourage the user.

Use simple language. Make the numbers clear and impactful. Do not include a preamble, just start with the analysis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get advice from AI. The API key might be missing or invalid.");
  }
};