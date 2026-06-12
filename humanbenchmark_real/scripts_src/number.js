let level=1
let started = false
let random_number
let submit = document.getElementById("submit")
let input_text = document.getElementById("input")
let match = document.getElementById("match")
let start = document.getElementById("begin")
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://tzlbxhbvucvjqxccftmm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGJ4aGJ2dWN2anF4Y2NmdG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTkwMjYsImV4cCI6MjA5NDY5NTAyNn0.Sc5KZ_anK1MClcrzJHGJIhuucpmUZhSHtmXsr0qmGtM')
const graph = document.getElementById('graf');

start.addEventListener("click", async function(){
    started = true
    random_number = Math.floor(Math.random()*Math.pow(10, level))
    match.innerText = random_number
    start.style.visibility = "hidden"
    await sleep(1200*level)
    match.innerText = "Enter the previously displayed number"
    submit.style.visibility = "visible"
    input_text.style.visibility = "visible"
})
submit.addEventListener("click", async function(){
    let submission = input_text.value
    if(started){
        if(random_number==submission){
            level++
            let min = Math.pow(10, level-1)
            let max = Math.pow(10, level) - 1
            random_number = Math.floor(Math.random()*(max - min + 1) + min)
            match.innerText = random_number
            submit.style.visibility = "hidden"
            input_text.style.visibility = "hidden"
            await sleep(1200*level)
            match.innerText = "Enter the previously displayed number"
            submit.style.visibility = "visible"
            input_text.style.visibility = "visible"
            input_text.value = ""
        }
        else{
            match.innerHTML = "You submit the wrong number<br>Your score was "+(level-1)+" digit(s)"
            const { error } = await supabase
            .from('number_result')
            .insert({longest_number: level-1, id_of_user:12345 })
            level = 1
            started = false
            start.style.visibility = "visible"
            submit.style.visibility = "hidden"
            input_text.style.visibility = "hidden"
            input_text.value = ""
        }
    }
    else{
        console.log("You have to begin the test")
    }
})
const {data, error} = await supabase
    .from('number_result')
    .select('longest_number')
let max_length = 0
let xValues = []
for(let i=0;i<data.length;i++){
    if(data[i].longest_number>max_length){
        max_length = data[i].longest_number
    }
}
let yValues = []
for(let i=0;i<max_length+1;i++){
    xValues[i] = i
    const {data, error} = await supabase
        .from('number_result')
        .select('longest_number', { count: 'exact'})
        .eq('longest_number', i) 
    yValues[i] = data.length
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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