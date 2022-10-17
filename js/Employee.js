// Lấy ra tất cả những thẻ có class là js-open chứa vào biến mảng openIF
const openIF = document.querySelectorAll('.js-open')
const closeIF = document.querySelectorAll('.js-close')
const popup = document.querySelector('.m-popup')

function handleClick()
{
    const loading = document.querySelector('.loading-data')
    loading.classList.add('display-b')
    setTimeout(()=>{
      loading.classList.remove('display-b')
      popup.classList.add('display-f')
      document.getElementById('Id-employee').focus()
    },500)

}
function removeFormInsert(){
    popup.classList.remove('display-f')
}
for(const i of openIF)
{
    i.addEventListener('click',handleClick)
}

for( const i of closeIF)
    i.addEventListener('click',removeFormInsert)


function stopTabIndex(event)
{
    event.preventDefault();
}

function dblClickTrTable(){
    handleClick()
}