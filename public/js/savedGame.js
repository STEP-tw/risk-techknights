// const isGameSaved = function (event) {
//   event.preventDefault();
//   const gameId = document.getElementById('gameId').value;
//   const playerId = document.getElementById('playerId').value;
//   fetch('/loadSavedGame', sendPostRequest({ gameId, playerId }))
//   .then(res=>console.log(res))
//   .then(data=>{
//     console.log(data);
//     if(data.msg){
//       document.getElementById('errorMsg').innerText = data.msg
//     }

//   })
// }