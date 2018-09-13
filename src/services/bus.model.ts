export interface Bus {
    line: string; // Night buses with N
    min?: number;
    time?: string; // hh:mm
    destinity: string;
}

export function busesMapper(data: any) {
    let result: Bus[] = [];

    if ((data.estimacion.parada_linea.bus && data.estimacion.parada_linea.bus.error) ||
    (data.estimacion.solo_parada.bus && data.estimacion.solo_parada.bus.error)) return [];

    for (let bus of (data.estimacion.parada_linea.bus || data.estimacion.solo_parada.bus)) {
        let newBus: Bus = {
            line: bus.linea,
            destinity: bus.destino
        };

        let timeMin = bus.minutos.split(' ')[0];
        if (timeMin) {
            if (timeMin == "Próximo") newBus.min = 0;
            else newBus.min = timeMin;
        } else newBus.time = bus.horaLlegada;

        result.push(newBus);
    }

    return result;
}