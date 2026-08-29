// Instruçoes de validação
// https://www.macoratti.net/alg_cpf.htm

export const validateCPF = (cpf) => {
    let validatedCpf;

    const array = cpf.split("", 9)

    let calc = []

    let acc = 0;

    let dig1, dig2;

    let mod;

    const fillCalc = (seed) => {
        let calc = []
        for (let x = seed; x >= 2; x--) {
            calc.push(x)
        }
        return calc;
    }

    const accumulate = (length) => {
        let acc = 0
        for (let i = 0; i < length; i++) {
            acc += +array[i] * calc[i]
        }
        return acc;
    }

    const returnMod = (acc) => {
        let mod = acc % 11
        if (mod < 2) {
            return 0
        } else {
            return 11 - (mod)
        } 
    }

    calc = fillCalc(array.length + 1)

    acc = accumulate(array.length)

    dig1 = returnMod(acc)

    calc = [];
    acc = 0;
    mod = null;
    
    array.push(`${dig1}`);

    calc = fillCalc(array.length + 1)

    acc = accumulate(array.length)

    dig2 = returnMod(acc)

    array.push(`${dig2}`);

    validatedCpf = array.join("")

    return validatedCpf == cpf
}