import React from 'react';
import PropTypes from "prop-types";
import {TextInput, StyleSheet, Text} from "react-native";
import {colors} from "../../theme/colors";

const Input = ({ placeholder, autoCorrect, autoCapitalize, value, onChangeText, error}) =>{
    const renderError = () =>{
        if(!error) return null;
        return <Text style ={styles.error}>{error}</Text>
    };

    return(
        <>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                autoCorrect={autoCorrect}
                autoCapitalize={autoCapitalize}
                value={value}
                onChangeText={onChangeText}
                />
            {renderError()}
        </>
    );
};

Input.propTypes = {
    placeholder: PropTypes.string,
    autoCorrect: PropTypes.bool,
    autoCapitalize: PropTypes.string,
    value: PropTypes.string,
    onChangeText: PropTypes.func.isRequired,
    error: PropTypes.string,
};

Input.defaultProps = {
  placeholder: '',
  autoCorrect: false,
  autoCapitalize: 'none',
  value: '',
  error: '',
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        height: 45,
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 3,
        borderRadius: 5,
        borderColor: colors.lightgray,
        borderStyle:'solid',
    },

    error: {
        width: '100%',
        marginTop: 5,
        fontSize: 12,
        color: colors.pink,
    },
});

export {Input}
