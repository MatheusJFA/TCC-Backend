import * as Yup from 'yup';

const validID = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
});

const validAddExperienceSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required(),
    }),
    body: Yup.object().shape({
        experience: Yup.number().required(),
    }),
});


export default { validID,validAddExperienceSchema};