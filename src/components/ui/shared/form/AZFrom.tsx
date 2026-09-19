import { ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";


interface formConfig {
    defaultValues?: Record<string, any>;
    resolver?: any;
}

interface IProps extends formConfig {
    children: ReactNode;
    onSubmit: SubmitHandler<any>;
    methods?: UseFormReturn<any>;
}

const AZForm = ({ children, onSubmit, defaultValues, resolver, methods: externalMethods }: IProps) => {
    const formConfig: formConfig = {};

    if (defaultValues) {
        formConfig["defaultValues"] = defaultValues;
    }

    if (resolver) {
        formConfig["resolver"] = resolver;
    }

    const internalMethods = useForm(formConfig);
    const methods = externalMethods || internalMethods;

    const submitHandler = methods.handleSubmit;

    return (
        <FormProvider {...methods}>
            <form onSubmit={submitHandler(onSubmit)}>{children}</form>
        </FormProvider>
    );
};

export default AZForm;
