interface formattable {
  regex: RegExp;
  format: string;
}

export const CEP: formattable = {
  regex: /(\d{2})(\d{3})(\d{3})$/,
  format: "$1.$2-$3"
};

export const CPF: formattable = {
  regex: /(\d{3})(\d{3})(\d{3})(\d{2})$/,
  format: "$1.$2.$3-$4"
};

export const CNPJ: formattable = {
  regex: /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, 
  format: "$1.$2.$3/$4-$5"
};

const formatField = (field: string, data: formattable): string | null => {
  if(field)
    return field.replace(data.regex, data.format);
  else 
    return null;
}

export default formatField;