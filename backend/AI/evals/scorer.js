/* 
    - You can create N number of such Scorers to use in your Evals
*/
export const ToolCallMatch = async ({ input, output, expected }) => {
  /* 
    Simple three nested check,
    If the response role is assistant ~ If tool-call then role is assistant
    Check if response.tool_calls is an array
    Check if response.tool_calls length is 1
    Check if response.tool_calls.function.name is same as expected.tool_calls.function.name
  */
  const score =
    output.role === 'assistant' &&
    Array.isArray(output.tool_calls) &&
    output.tool_calls.length === 1 &&
    output.tool_calls[0].function?.name ===
      expected.tool_calls[0].function?.name
      ? 1
      : 0

  return {
    name: 'ToolCallMatch',
    score,
  }
}
