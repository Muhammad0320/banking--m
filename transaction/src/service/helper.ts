interface DateReturnType {
  yy: number;
  mm: number;
  dd: number;
}

export const dateFxns = (): DateReturnType => {
  const date = new Date();

  return {
    yy: date.getFullYear() + 5,
    mm: date.getMonth(),
    dd: date.getDate() - 1
  };
};
