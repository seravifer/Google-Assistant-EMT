import { parse } from 'node-html-parser';

export function balanceMapper(body: any) {
  return new Promise<Number>((resolve, reject) => {
    let html = parse(body + '</span>').querySelector('strong');
    if (html) resolve(+html.text.substring(0, 2));
    else reject();
  });
}