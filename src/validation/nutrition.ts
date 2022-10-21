import * as Yup from 'yup';
import { CuisineValues } from '@/types/cuisine.type';

const generateMealSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }).required(),
    body: Yup.object().shape({
        excludes: Yup.string().required()
    }).required(),
});


const searchRecipesSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }).required(),
    body: Yup.object().shape({
        query: Yup.string().required(),
        cuisine: Yup.string().oneOf(CuisineValues).required(),
        excludeCuisine: Yup.string().optional(),
        equipment: Yup.string().optional(),
        includeIngredients: Yup.string().optional(),
        excludeIngredients: Yup.string().optional(),
    }).required(),
});

const getCurrentDietSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }).required(),
    body: Yup.object().shape({
        date: Yup.date().max(new Date()).optional()
    }).required(),
});


const addOrRemoveIntakeSchema = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }).required(),
    body: Yup.object().shape({
        information: Yup.object().shape({
            date: Yup.date().max(new Date()).optional(),
            calories: Yup.number().positive().required(),
            proteins: Yup.number().positive().required(),
            fats: Yup.number().positive().required(),
            carbs: Yup.number().positive().required()
        }),
    }).required()
});


const addWeightTracker = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }).required(),
    body: Yup.object().shape({
        information: Yup.object().shape({
            weightTrackerId: Yup.string().uuid().required()

        }),
    }).required()
});

const removeWeightTracker = Yup.object().shape({
    params: Yup.object().shape({
        id: Yup.string().uuid().required()
    }).required(),
    body: Yup.object().shape({
        information: Yup.object().shape({
            weight: Yup.number().positive().required()
        }),
    }).required()
});


export default {
    generateMealSchema,
    searchRecipesSchema,
    getCurrentDietSchema,
    addOrRemoveIntakeSchema,
    addWeightTracker,
    removeWeightTracker
}