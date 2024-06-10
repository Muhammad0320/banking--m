

interface DateReturnType {

    year: number,
    month: number

};

export const calcDate = (): DateReturnType => {

    const date = new Date();

    
  return  { year: date.getFullYear() + 5, month: date.getMonth() }

}