import { confirm } from "@inquirer/prompts";

/**
 * Convenience wrapper around current prompt library of choice to present a
 * confirmation dialog.
 *
 * Applies stripIndent to the input message.
 *
 * Returns the true false value of the prompt.
 */
export async function promptConfirm(
  message: string,
  defaultValue: boolean,
  onConfirmed?: () => void
): Promise<boolean> {
  const result = await confirm({
    message,
    default: defaultValue,
  });

  // When yes/true is selected, run the onConfirmed callback
  if (result) onConfirmed?.();

  return result;
}
