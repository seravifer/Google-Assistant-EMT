import { parse } from 'node-html-parser';

export function balanceMapper(body: any) {
  return new Promise<Number>((resolve, reject) => {
    let html = parse(body + '</span>').querySelector('strong');
    if (html) resolve(+html.text.substring(0, 2));
    else reject();
  });
}

export function balanceMapperMetro(body: any) {
  return new Promise<Number>((resolve, reject) => {
    let html = parse(body).querySelectorAll('p')[1].childNodes[2].rawText;
    if (html) resolve(+html.split(' ')[1].replace(/,/g, '.'));
    else reject();
  });
}