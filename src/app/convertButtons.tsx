import React, { useMemo, useState } from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

interface SelectProps {
    file: File;
    uniqueKey: string;
    setType: (type: { [key: string]: string }) => void;
}

export const SelectElement: React.FC<SelectProps> = ({ file, uniqueKey, setType }) => {
    const convertTypes: string[] = useMemo(() => {
        switch (file.type) {
            case 'image/gif':
                return ['jpg', 'png', 'webp', 'svg'];
            case 'image/jpeg':
                return ['png', 'svg', 'webp', 'gif'];
            case 'image/png':
                return ['jpg', 'svg', 'webp', 'gif'];
            case 'image/svg':
                return ['jpg', 'png', 'webp', 'gif'];
            case 'application/pdf':
                return ['jpg', 'png', 'svg', 'webp', 'txt', 'html', 'docx']
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return ['pdf', 'txt', 'html', 'odt', 'jpg', 'png,', 'webp', 'pptx'];
            default:
                return [];
        }
    }, [file.type]);

    const [selectType, setSelectType] = useState<{ [key: string]: string }>({});

    const handleChange = (event: SelectChangeEvent) => {
        const newType = event.target.value;
        setSelectType({ ...selectType, [uniqueKey]: newType });
        setType({ [uniqueKey]: newType });
    };

    return (
        <Select
            key={uniqueKey + '_select'}
            className="text-black-950 bg-black-50 max-w-[7rem] h-[2.5rem] w-1/3"
            value={selectType[uniqueKey] || ''}
            onChange={handleChange}
            sx={{
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'gray',
                }
            }}
        >
            {convertTypes.map((type, index) => (
                <MenuItem key={uniqueKey + '_' + type + index} value={type} sx={{'&.Mui-selected': {backgroundColor: '#6d6d6d'}, '&.Mui-selected:hover': {backgroundColor: '#888888'}}}>
                    {type.toUpperCase()}
                </MenuItem>
            ))}
        </Select>
    );
};