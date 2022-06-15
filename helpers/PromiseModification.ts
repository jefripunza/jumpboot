export async function createPromise(
  array: any[],
  onPrebuild: (row: object | { [key: string]: any } | any) => any
): Promise<any[]> {
  return new Promise((onResult, onError) => {
    Promise.all(array.map(async (row) => onPrebuild(row)))
      .then((value) => onResult(value))
      .catch((error) => onError(error));
  });
}

export const delay = async (timeout = 500) => {
  await new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, timeout);
  });
};
