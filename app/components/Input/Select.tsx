"use client";

import ReactSelect from "react-select";

interface SelectProps {
    disabled?: boolean;
    label: string;
    value?: Record<string, any>;
    onChange: (value: Record<string, any>) => void;
    options: Record<string, any>[];
}

const Select: React.FC<SelectProps> = ({
    disabled,
    label,
    onChange,
    value,
    options,
}) => {
    return (
        <div className="z-[100]">
            <label className="block text-lg font-medium leading-6 text-[#d1d3d7]">
                {label}
            </label>
            <div className="mt-2">
                <ReactSelect
                    isDisabled={disabled}
                    value={value}
                    onChange={onChange}
                    isMulti
                    options={options}
                    menuPortalTarget={document.body}
                    styles={{
                        menuPortal: (base) => ({
                            ...base,
                            zIndex: 9999,
                            color: "#000",
                        }),
                    }}
                    classNames={{ control: () => "text-lg" }}
                />
            </div>
        </div>
    );
};

export default Select;
