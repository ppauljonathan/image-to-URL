const input=document.querySelector("input[name='file']");
const imageUrl=document.querySelector("input[name='imageUrl']");
input.onchange=function(){
    const reader=new FileReader();
    reader.onload=function(e){
        imageUrl.value=e.target.result;
    };
    reader.readAsDataURL(this.files[0]);
}