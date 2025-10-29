'use server';

/**
 * @fileOverview A flow for generating event descriptions and promotional text based on event details.
 *
 * - generateEventDescription - A function that generates event descriptions and promotional text.
 * - GenerateEventDescriptionInput - The input type for the generateEventDescription function.
 * - GenerateEventDescriptionOutput - The return type for the generateEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  eventName: z.string().describe('The name of the event.'),
  eventDate: z.string().describe('The date of the event (e.g., YYYY-MM-DD).'),
  eventTime: z.string().describe('The time of the event (e.g., HH:MM AM/PM).'),
  eventDescription: z.string().describe('A brief description of the event.'),
  targetAudience: z.string().describe('The target audience for the event (e.g., parents, students).'),
  keyHighlights: z
    .string()
    .describe('Key highlights or attractions of the event (e.g., guest speakers, performances).'),
});
export type GenerateEventDescriptionInput = z.infer<typeof GenerateEventDescriptionInputSchema>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed description of the event.'),
  promotionalText: z.string().describe('Promotional text for advertising the event.'),
});
export type GenerateEventDescriptionOutput = z.infer<typeof GenerateEventDescriptionOutputSchema>;

export async function generateEventDescription(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `You are an expert marketing assistant, specialized in creating compelling event descriptions and promotional content.

  Based on the event details provided, generate a detailed description and promotional text to attract the target audience.

  Event Name: {{eventName}}
  Date: {{eventDate}}
  Time: {{eventTime}}
  Description: {{eventDescription}}
  Target Audience: {{targetAudience}}
  Key Highlights: {{keyHighlights}}

  Description:
  Promotional Text: `,
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
