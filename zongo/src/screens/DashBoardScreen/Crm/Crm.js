import { View, StyleSheet } from 'react-native';
import React from 'react';
import HeaderView from '../../../commonComponents/HeaderView';
import { pixelSizeHorizontal } from '../../../commonComponents/ResponsiveScreen';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import { goBack } from '../../../navigation/RootNavigation';
import LoadingView from '../../../commonComponents/LoadingView';

const Crm = ({ navigation }) => {

    return (
        <>
            <HeaderView
                title={'Zongo'}
                isProfilePic={true}
                imgUri={
                    'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
                containerStyle={{
                    paddingHorizontal: pixelSizeHorizontal(-20),
                }}>
                <View style={{ marginHorizontal: 20 }}>
                    <HeaderBackView
                        title="CRM"
                        isBack={true}
                        onPressBack={() => {
                            goBack();
                        }}
                        onPressMenu={() => {
                            navigation.toggleDrawer();
                        }}
                    />
                </View>
            </HeaderView>
            {/* {isLoading && <LoadingView />} */}
        </>
    );
};

export default Crm;

const styles = StyleSheet.create({
    
});
