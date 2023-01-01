// Post Function
async function passInfo(){
 const myurl  = $("#url").val();
 const data = {
        websiteName: $("#websiteName").val(),
        url: myurl,
    }
 const response = await $.post("https://urlshortener.alfiyasiddique.repl.co/api/shorturl", data);
 if(response.error){
   console.log(response);
    alert(response.error)
 }else{
   await $.get("https://urlshortener.alfiyasiddique.repl.co/userHome");
 }
 remover();
}

 async function removeURL(id){
  await $.post("https://urlshortener.alfiyasiddique.repl.co/deleteURL", {dataID:id});
  location.reload()
}

function adder(){
 if(check100()){
   alert("Number of url stored is reached to limit 100")
 }
 else{
   document.body.style.height = "100vh"
   document.body.style.overflow = "hidden"
     $("#layer").removeClass("hidden");
     $("#adder").removeClass("hidden")
 }
}

function remover(){
   document.body.style.height = "100%"
 document.body.style.overflow = "none"
   $("#layer").addClass("hidden");
   $("#adder").addClass("hidden");
  // location.reload();
}

function check100(){
   return document.getElementById("rangebar").value >= 100? true: false;
} 