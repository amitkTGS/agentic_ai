let setLoadingRef = null;

export const setLoader = (value) => {
  if (setLoadingRef) {
    setLoadingRef(value);
  }
};

export const registerLoader = (setLoading) => {
  setLoadingRef = setLoading;
};