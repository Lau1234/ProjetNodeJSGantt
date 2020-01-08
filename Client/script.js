gantt.config.xml_date = "%Y-%m-%d %H:%i";
gantt.init("gantt_here");
gantt.parse({
  data: [
    {
      id: 1,
      resource_id: "3",
      text: "Project #1",
      start_date: null,
      duration: null,
      parent: 0,
      progress: 0,
      color: "#000000",
      open: true
    },
    {
      id: 2,
      text: "Task #1",
      start_date: "2019-08-01 00:00",
      duration: 5,
      parent: 1,
      progress: 1
    },
    {
      id: 3,
      text: "Task #2",
      start_date: "2019-08-06 00:00",
      duration: 2,
      parent: 1,
      progress: 0.5
    },
    {
      id: 4,
      text: "Task #3",
      start_date: null,
      duration: null,
      parent: 1,
      progress: 0.8,
      open: true
    },
    {
      id: 5,
      text: "Task #3.1",
      start_date: "2019-08-09 00:00",
      duration: 2,
      parent: 4,
      progress: 0.2
    },
    {
      id: 6,
      text: "Task #3.2",
      start_date: "2019-08-11 00:00",
      duration: 1,
      parent: 4,
      progress: 0
    }
  ],
  links: [
    { id: 1, source: 2, target: 3, type: "0" },
    { id: 2, source: 3, target: 4, type: "0" },
    { id: 3, source: 5, target: 6, type: "0" }
  ]
});
getGantt();
function getGantt() {
  var url = "http://localhost:3000/gantt";

  var options = {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    mode: "cors",
    cache: "default"
    //   body: JSON.stringify({
    //     "firstname": "Nic",
    //     "lastname": "Raboy"
    // })
  };

  // var request = new Request("", options);

  // request.url = "localhost:3000/gantt";

  // fetch(request).then(function(response, error) {
  //   if (error) {
  //     console.log("error:", error);
  //   }
  //   console.log(response);
  // });

  fetch(url, options)
    .then(response => response.json())
    .then(response => {
      console.log(response);
    });
}
