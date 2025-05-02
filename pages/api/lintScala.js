const { parseSource } = require("scalameta-parsers");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { code } = req.body;

  try {
    const tree = await parseSource(code);
    console.log("Parsed Tree:", tree);

    if (tree.error) {
      // Extract error info
      return res.status(200).json({
        success: false,
        errors: [
          {
            message: tree.error,
            line: tree.lineNumber ?? 0,
            column: tree.columnNumber ?? 0,
          },
        ],
      });
    }

    // No syntax error
    return res.status(200).json({ success: true, errors: [] });

  } catch (err) {
    // This is rare unless parser totally fails
    return res.status(200).json({
      success: false,
      errors: [
        {
          message: err.message,
          line: 0,
        },
      ],
    });
  }
}
