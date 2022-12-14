
module.exports = {
    routes: [
      {
        handler: "exam.generate",
        method: "POST",
        path: "/exam/generate",
      },
      {
        handler: "exam.start",
        path: "/exam/start",
        method: "POST",
      },
      {
        handler: "exam.all",
        path: "/exam/all",
        method: "GET",
      },
      {
        handler: "exam.submit",
        path: "/exam/submit",
        method: "POST",
      },
      {
        handler: "exam.selection",
        path: "/exam/selection/:examId/:questionId",
        method: "POST",
      },
      {
        handler: "exam.exam",
        path: "/exam/:examId",
        method: "GET",
      },
      {
        handler: "exam.question",
        path: "/exam/:examId/:questionId",
        method: "GET",
      },
    ],
  };
  