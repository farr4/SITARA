function showMessage(
  title,
  message,
  callback
){

  document.getElementById(
    "modal-title"
  ).textContent = title;

  document.getElementById(
    "modal-message"
  ).textContent = message;

  document.getElementById(
    "modal-cancel"
  ).style.display = "none";

  document.getElementById(
    "modal-ok"
  ).onclick = function(){

    closeModal();

    if(callback){
      callback();
    }

  };

  document.getElementById(
    "message-modal"
  ).classList.add(
    "active"
  );

}

function showConfirm(
  title,
  message,
  callback
){

  document.getElementById(
    "modal-title"
  ).textContent = title;

  document.getElementById(
    "modal-message"
  ).textContent = message;

  document.getElementById(
    "modal-cancel"
  ).style.display =
    "inline-flex";

  document.getElementById(
    "modal-ok"
  ).onclick = function(){

    closeModal();

    if(callback){
      callback();
    }

  };

  document.getElementById(
    "modal-cancel"
  ).onclick = function(){

    closeModal();

  };

  document.getElementById(
    "message-modal"
  ).classList.add(
    "active"
  );

}

function closeModal(){

  document.getElementById(
    "message-modal"
  ).classList.remove(
    "active"
  );

}  