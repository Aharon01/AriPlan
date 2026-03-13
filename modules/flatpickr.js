export function initCalendar(selector) {
  return flatpickr(selector, {
    enableTime:true,
    dateFormat:'Y-m-d H:i',
    altInput:true,
    altFormat:'d.m.Y H:i',
    altInputClass:'flatpickr-input',
    disableMobile:true,
    onReady:(_,__,instance)=>{
      instance.altInput.placeholder='Ввести дедлайн';
      instance.altInput.addEventListener('focus',()=>instance.open());
    }
  });
}