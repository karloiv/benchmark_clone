let target = document.getElementById("target")
let begin = document.getElementById("begin")
let text = document.getElementById("text")
const graph = document.getElementById('graf');
const xValues = ["0-25ms", "26-50ms", "51-75ms", "76-100ms", "101-125ms", "126-150ms", "151-175ms", "176-200ms", "201-225ms", "226-250ms", "251-275ms", "276-300ms", "301-325ms", "326-350ms", "351-375ms", "376-400ms", "401-425ms", "426-450ms", "451-475ms", "476-500ms", "501-525ms", "526-550ms", "551-575ms", "576-600ms"];
let yValues = []
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase = createClient('https://tzlbxhbvucvjqxccftmm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGJ4aGJ2dWN2anF4Y2NmdG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMTkwMjYsImV4cCI6MjA5NDY5NTAyNn0.Sc5KZ_anK1MClcrzJHGJIhuucpmUZhSHtmXsr0qmGtM')
let spaceWidth;
let spaceHeight;
let low = 0
let high = 25
let hitsRemaining = 30
let totalHits = hitsRemaining
let startTime = null
let result = 0
target.style.visibility="hidden"
function initCircle() {
  spaceWidth = 25;
  spaceHeight = 500 - 115;
  target.style.top = Math.round(Math.random() * spaceHeight) + 90 + 'px';
  target.style.left = Math.round(Math.random() * spaceWidth) + 35 + '%';
  target.style.visibility="visible"
  begin.style.visibility="hidden"
  text.style.visibility="hidden"
  target.addEventListener('click', moveCircle)
}

async function moveCircle() {
  target.style.top = Math.round(Math.random() * spaceHeight) + 90 + 'px';
  target.style.left = Math.round(Math.random() * spaceWidth) + 35 + '%';
  if(hitsRemaining==totalHits){
    startTime = performance.now()
  }
  hitsRemaining--
  if(hitsRemaining==0){
    result = Math.round((performance.now() - startTime)/totalHits)
    text.innerText = "Your average time between clicks: "+result+"ms"
    text.style.visibility = "visible"
    hitsRemaining=totalHits
    target.style.visibility="hidden"
    begin.style.visibility="visible"
    const { error } = await supabase
    .from('aim_results')
    .insert({average_time: result, id_of_user:12345 })
  }
}
begin.addEventListener("click", initCircle)
for(let i=0;i<xValues.length;i++){
    const { data, error } = await supabase
  .from('aim_results')
  .select("average_time", { count: 'exact'})
  .lte("average_time", high)
  .gt("average_time", low)
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