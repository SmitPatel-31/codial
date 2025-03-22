const JUDGE0_URL = "http://44.203.202.62:2358";


export async function submitCode(code, language, examData) {
    console.log("Submitting Code:", code);
    console.log("Language:", language);

    const testCases = examData?.examples || [];
    const results = [];
    const total = testCases.length;
    var passedTests = 0;
    try {
        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            console.log(`Test Case ${i + 1}:`, testCase.input, "Expected:", testCase.output);

            // Submit the code for this test case
            const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language_id: language === "python" ? 71 : 62, // 71 = Python, 62 = Java
                    source_code: code,
                    stdin: testCase.input, 
                    expected_output: testCase.output,
                }),
            });

            if (!response.ok) {
                throw new Error(`Failed to submit code: ${response.statusText}`);
            }

            // Get submission result
            const result = await response.json();
            if (result.status?.id == 3) {
                passedTests++;
            }
            console.log(`Execution Result for Test Case ${i + 1}:`, result);
            results.push(result);
        }

        // Check which test cases passed
        return { passed: passedTests, total: total };

    } catch (error) {
        console.error("Error executing code:", error);
        alert("An error occurred while running the code.");
        return null;
    }
}

export default submitCode;
