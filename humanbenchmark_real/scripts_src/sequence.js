const buttons = document.querySelectorAll('.seq_button')
let text = document.getElementById("text")
const arrayButtons = Array.from(buttons)
let startButton = document.getElementById("begin")
const graph = document.getElementById('graf');
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://tzlbxhbvucvjqxccftmm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGJ4aGJ2dWN2anF4Y2NmdG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTkwMjYsImV4cCI6MjA5NDY5NTAyNn0.Sc5KZ_anK1MClcrzJHGJIhuucpmUZhSHtmXsr0qmGtM')
let next_step = Math.floor(Math.random()*buttons.length+1)
let step_array = []
step_array.push(next_step)
let i = 0
arrayButtons.forEach((button) => {
    button.onclick = showId
})
let score = 0
showSequence(step_array)
startButton.addEventListener("click", function(){
    text.style.visibility = "hidden"
    startButton.style.visibility = "hidden"
    for(let j=0;j<arrayButtons.length;j++){
        arrayButtons[j].style.visibility = "visible"
    }
    showSequence(step_array)
})
async function showId(event){
    console.log("clicked button: "+event.target.id)    
    if(step_array[i] == event.target.id){
        i++;
        if(i == step_array.length){
            i = 0
            next_step = Math.floor(Math.random()*(buttons.length-1)+1)
            step_array.push(next_step)
            showSequence(step_array)
        }
    }
    else if(step_array[i] != event.target.id){
        i = 0
        score = step_array.length - 1        
        text.innerHTML = "Your score was "+score+" button(s)"
        for(let i=0;i<arrayButtons.length;i++){
        arrayButtons[i].style.visibility = "hidden"
        }
        text.style.visibility = "visible"
        startButton.style.visibility = "visible"
        const { error } = await supabase
            .from('sequence_results')
            .insert({score: step_array.length - 1 , id_of_user:12345, board_size: Math.sqrt(arrayButtons.length)})
        step_array.length = 0 
        next_step = Math.floor(Math.random()*(buttons.length-1)+1)
        step_array.push(next_step)
    }
}
async function showSequence(step_array){
    for(let i=0;i<arrayButtons.length;i++){
        arrayButtons[i].disabled = true
    }
    for(let i=0;i<step_array.length;i++){
        arrayButtons[step_array[i]-1].style.backgroundColor='lightgreen'
        await sleep(1000)
        arrayButtons[step_array[i]-1].style.backgroundColor='#afafaf'
        await sleep(50)
    }
    for(let i=0;i<arrayButtons.length;i++){
        arrayButtons[i].disabled = false
    }
}
if(arrayButtons.length == 16){
    const {data, error} = await supabase
        .from('sequence_results')
        .select('score')
        .eq('board_size', 4)
    let max_length = 0
    let xValues = []
    for(let i=0;i<data.length;i++){
        if(data[i].score>max_length){
            max_length = data[i].score
        }
    }
    let yValues = []
    for(let i=0;i<max_length+1;i++){
        xValues[i] = i
        const {data, error} = await supabase
            .from('sequence_results')
            .select('score', { count: 'exact'})
            .eq('score', i) 
        yValues[i] = data.length
    }

    new Chart(graph, {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          fill: false,
          lineTension: 0.3,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }]
      },
      options: {
        plugins: {
          legend: {display:false},
          title: {
            display: true,
            text: "Statistics of all users",
            font: {size:16}
          }
        }
      }
    });
}
else{
const {data, error} = await supabase
        .from('sequence_results')
        .select('score')
        .eq('board_size', 5)
    let max_length = 0
    let xValues = []
    for(let i=0;i<data.length;i++){
        if(data[i].score>max_length){
            max_length = data[i].score
        }
    }
    let yValues = []
    for(let i=0;i<max_length+1;i++){
        xValues[i] = i
        const {data, error} = await supabase
            .from('sequence_results')
            .select('score', { count: 'exact'})
            .eq('score', i) 
        yValues[i] = data.length
    }

    new Chart(graph, {
      type: "line",
      data: {
        labels: xValues,
        datasets: [{
          fill: false,
          lineTension: 0.3,
          backgroundColor: "rgba(0,0,255,1.0)",
          borderColor: "rgba(0,0,255,0.1)",
          data: yValues
        }]
      },
      options: {
        plugins: {
          legend: {display:false},
          title: {
            display: true,
            text: "Statistics of all users",
            font: {size:16}
          }
        }
      }
    });
}
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}