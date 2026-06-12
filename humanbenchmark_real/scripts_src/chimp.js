import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://tzlbxhbvucvjqxccftmm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGJ4aGJ2dWN2anF4Y2NmdG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTkwMjYsImV4cCI6MjA5NDY5NTAyNn0.Sc5KZ_anK1MClcrzJHGJIhuucpmUZhSHtmXsr0qmGtM')

let started = false
const buttons = document.querySelectorAll('.testbox .chimp')
const startButton = document.getElementById('start')
const message = document.getElementById('message')
const graph = document.getElementById('graf');

const arrayButtons = Array.from(buttons)
arrayButtons.forEach((button) => {
    button.onclick = isCorrect
})

let life_count = 3
let step = 0
let test_length = 4
let id_sequence = []
startButton.onclick = startTest
function startTest(){
    startButton.style.visibility="hidden"
    message.style.visibility="hidden"
    for(let i=0;i<test_length;i++){
        let random = Math.floor(Math.random()*buttons.length+1)
        while(id_sequence.includes(random)){
            random = Math.floor(Math.random()*buttons.length+1)
        }
        id_sequence[i] = random
        arrayButtons[id_sequence[i]-1].style.visibility = "visible"
        arrayButtons[id_sequence[i]-1].innerHTML = i+1
    }
}
async function isCorrect(event){
    let id = event.target.id
    console.log(id)
    if(life_count!=0){
        if(step==0){
            for(let i=0;i<test_length;i++){
                arrayButtons[id_sequence[i]-1].innerHTML = ""
            }
        }
        if(parseInt(id) === id_sequence[step]){
            step++
        }
        else{
            life_count--
            step = 0
            for(let i=0;i<test_length;i++){
                arrayButtons[id_sequence[i]-1].style.visibility = "hidden"
            }
            message.innerText = "You made a mistake"
            startButton.innerText = "Restart at length: "+test_length
            message.style.visibility="visible"
            startButton.style.visibility = "visible"
        }
        if(step == id_sequence.length){
            step = 0
            for(let i=0;i<test_length;i++){
                arrayButtons[id_sequence[i]-1].style.visibility = "hidden"
            }
            id_sequence = []
            test_length++;
            for(let i=0;i<test_length;i++){
                let random = Math.floor(Math.random()*buttons.length+1)
                while(id_sequence.includes(random)){
                random = Math.floor(Math.random()*buttons.length+1)
                }
                id_sequence[i] = random
                arrayButtons[id_sequence[i]-1].style.visibility = "visible"
                arrayButtons[id_sequence[i]-1].innerHTML = i+1
            }
        }
    }
    if(life_count==0){
        for(let i=0;i<test_length;i++){
            arrayButtons[id_sequence[i]-1].style.visibility = "hidden"
        }
        life_count = 3
        startButton.innerText = "Restart the test"
        startButton.style.visibility = "visible"
        message.innerText = "You have finished the test with a score of: "+ test_length
        message.style.visibility="visible"
        const { error } = await supabase
            .from('chimp_results')
            .insert({final_length: test_length, id_of_user:12345 })
        test_length = 4
        step = 0
    }
}
const {data, error} = await supabase
    .from('chimp_results')
    .select('final_length')
console.log(data)
let max_length = 0
let xValues = []
for(let j=0;j<data.length;j++){
    if(data[j].final_length>max_length){
        max_length = data[j].final_length
        console.log(j)
    }
}
console.log(max_length)
let yValues = []
for(let j=0;j<max_length+1;j++){
    xValues[j] = j+4
    const {data, error} = await supabase
        .from('chimp_results')
        .select('final_length', { count: 'exact'})
        .eq('final_length', j+4)
    yValues[j] = data.length
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