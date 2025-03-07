const ExamSection = ({ title, exams, renderAction }) => (
  <div className="mb-6">
    <h4 className="text-xl font-semibold text-gray-800 mb-3">{title}</h4>
    {exams.length > 0 ? (
      exams.map((exam) => {
        // Handle Timestamp or Date strings
        const examStartDate = exam.date.seconds ? new Date(exam.date.seconds * 1000) : new Date(exam.date);
        const examEndDate = exam.endDate.seconds ? new Date(exam.endDate.seconds * 1000) : new Date(exam.endDate);

        return (
          <div key={exam.id} className="p-5 mb-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all flex justify-between items-center">
            <div>
              <strong className="text-lg font-medium text-black-600">{exam.name}</strong>
              <div className="mt-3 text-gray-700">
                <p className="text-sm">
                  <span className="font-semibold">Start:</span> {examStartDate.toLocaleString()}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">End:</span> {examEndDate.toLocaleString()}
                </p>
              </div>
            </div>
            {/* Show Start button if renderAction is provided */}
            {renderAction && renderAction(exam)}
          </div>
        );
      })
    ) : (
      <div className="p-4 bg-gray-100 rounded-lg text-gray-600">
        No {title.toLowerCase()} exams
      </div>
    )}
  </div>
);

export default ExamSection;
