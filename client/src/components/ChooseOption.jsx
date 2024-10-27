import React from 'react';
import { useItemContext } from './EditedItemContext.jsx';

export default function ChooseOption(props) {

    const { itemState, updateEditItemState } = useItemContext();

    let sumAllChanges = 0;

    // Corrected to prevent mutation of the state directly
    function changePrice(extraPrice, iWantToAdd) {
        if (!isNaN(extraPrice)) {
            updateEditItemState('newPrice', itemState.newPrice + extraPrice * (iWantToAdd ? 1 : -1));
        }
    }

    return (
        <div className='vertical_container'>
            <span className='emphContent'> בחירת {itemState.options[props.indexHeadOption].title} </span>
            {
                // Mapping over the options array
                itemState.options[props.indexHeadOption].optionCollection.map((option, i) => {

                    return (
                        <button
                            className={(option.isChecked ? "checked_button" : "button") + " content"}
                            key={option.optionTitle}
                            onClick={() => {

                                // create a copy of the optionsArray to avoid mutation
                                const optionsArray = [...itemState.options[props.indexHeadOption].optionCollection]; // copy array
                                const clickedOption = { ...optionsArray[i] }; // copy the clicked option

                                let countChecked = 0;

                                // handling multiple selection case
                                if (clickedOption.isMultiple) {
                                    for (let j = 0; j < optionsArray.length; j++) {
                                        if (optionsArray[j].isChecked) {
                                            countChecked++;
                                            if (!optionsArray[j].isMultiple) {
                                                countChecked--;
                                                optionsArray[j] = { ...optionsArray[j], isChecked: false }; // avoid mutating the original
                                                changePrice(optionsArray[j].extraPrice, false);
                                            }
                                        }
                                    }

                                    if (clickedOption.isChecked && countChecked > 1) {
                                        clickedOption.isChecked = false;
                                        changePrice(clickedOption.extraPrice, false);
                                    } else if (!clickedOption.isChecked) {
                                        clickedOption.isChecked = true;
                                        changePrice(clickedOption.extraPrice, true);
                                    }
                                } else { // handling single selection case
                                    if (!clickedOption.isChecked) {
                                        // uncheck other options if single selection
                                        for (let j = 0; j < optionsArray.length; j++) {
                                            if (optionsArray[j] !== clickedOption && optionsArray[j].isChecked) {
                                                optionsArray[j] = { ...optionsArray[j], isChecked: false }; // copy each item
                                                if (!isNaN(optionsArray[j].extraPrice))
                                                    sumAllChanges += optionsArray[j].extraPrice * -1;
                                            }
                                        }
                                        clickedOption.isChecked = true;
                                        if (!isNaN(clickedOption.extraPrice))
                                            sumAllChanges += clickedOption.extraPrice;
                                        changePrice(sumAllChanges, true);
                                        sumAllChanges = 0;
                                    }
                                }

                                // update the entire options array
                                const updatedOptionsArray = optionsArray.map((opt, index) =>
                                    index === i ? clickedOption : opt
                                );

                                // update the state
                                updateEditItemState("options",
                                    itemState.options.map((opt, index) =>
                                        index === props.indexHeadOption
                                            ? { ...opt, optionCollection: updatedOptionsArray }
                                            : opt
                                    )
                                );
                            }}>
                            {option.optionTitle}
                        </button>
                    );
                })
            }
        </div>
    );
}