import { View, StyleSheet } from 'react-native';
import HeaderBackView from '../../../commonComponents/HeaderBackView';
import { goBack } from '../../../navigation/RootNavigation';

const Crm = ({ navigation }) => {

    return (
        <>
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
            <View style={{ marginHorizontal: 20 }}>

            </View>
            {/* {isLoading && <LoadingView />} */}
        </>
    );
};

export default Crm;

const styles = StyleSheet.create({

});
