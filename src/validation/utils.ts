import * as Yup from 'yup';

const validID = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
});

export default { validID };