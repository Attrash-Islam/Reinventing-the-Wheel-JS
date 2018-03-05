
(() => {
  const MODEL_CHANGE_EVENT = "modelChange";
  const modelChange = new Event(MODEL_CHANGE_EVENT);
  const NG_MODEL = "ng-model";
  const NG_BIND = "ng-bind";
  window.model = {};

  const ngModelTags = document.querySelectorAll(`[${NG_MODEL}]`);

  ngModelTags.forEach(ngModel => {
    ngModel.addEventListener("input", event => {
      const modelAttr = ngModel.getAttribute(`${NG_MODEL}`);
      window.model[modelAttr] = event.target.value;
      document.dispatchEvent(modelChange);
    });
  });

  document.addEventListener(MODEL_CHANGE_EVENT, () => {
    Object.keys(window.model).forEach(modelKey => {
      const ngModelTags = document.querySelectorAll(`[${NG_MODEL}=${modelKey}]`);
      ngModelTags.forEach(model => model.value = window.model[modelKey]);
      const ngBindTags = document.querySelectorAll(`[${NG_BIND}=${modelKey}]`);
      ngBindTags.forEach(bind => bind.textContent = window.model[modelKey]);
    });
  });

})();
