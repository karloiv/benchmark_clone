import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
let button = document.getElementById("react")
const supabase = createClient('https://tzlbxhbvucvjqxccftmm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGJ4aGJ2dWN2anF4Y2NmdG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTkwMjYsImV4cCI6MjA5NDY5NTAyNn0.Sc5KZ_anK1MClcrzJHGJIhuucpmUZhSHtmXsr0qmGtM')
const graph = document.getElementById('graf');
const xValues = ["0-25ms", "26-50ms", "51-75ms", "76-100ms", "101-125ms", "126-150ms", "151-175ms", "176-200ms", "201-225ms", "226-250ms", "251-275ms", "276-300ms", "301-325ms", "326-350ms", "351-375ms", "376-400ms", "401-425ms", "426-450ms", "451-475ms", "476-500ms", "501-525ms", "526-550ms", "551-575ms", "576-600ms"];
let yValues = []
let low = 0
let high = 25
let started = false
let startTime = null
let interval = null
button.addEventListener("click", async function(){
    if(!started){
        button.style.backgroundColor = 'red'
        button.textContent="Wait..."
        started=true
        await sleep(Math.floor(Math.random()*6500+1000))
        button.style.backgroundColor = 'lightgreen'
        button.textContent = "Click!"
        startTime = performance.now()
    }
    else{
        if(button.style.backgroundColor == 'lightgreen'){
            let endTime = Math.round(performance.now() - startTime)
            button.innerHTML = "Your result is: " + endTime + "ms" +"<br>Click to start the test again!"
            const { error } = await supabase
            .from('reaction_results')
            .insert({final_time: endTime, id_of_user:12345 })
        }
        if(button.style.backgroundColor != 'lightgreen') {
            button.style.backgroundColor = 'orange'
            button.textContent = "You clicked too soon!"
        }
        started = false;
        interval = null;
    }
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
for(let i=0;i<xValues.length;i++){
    const { data, error } = await supabase
  .from('reaction_results')
  .select("final_time", { count: 'exact'})
  .lte("final_time", high)
  .gt("final_time", low)
    yValues[i] = data.length
    low += 25
    high += 25
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
