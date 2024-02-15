import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Text, ScrollView } from 'react-native';
import { black, white } from '../../../constants/Color';
import { BOLD, FontSize, MEDIUM } from '../../../constants/Fonts';

const EmojiPicker = ({ emojiData,text }) => {
  const [selectedCategory, setSelectedCategory] = useState(Object.keys(emojiData)[0]);

  const handleCategoryChange = category => {
    setSelectedCategory(category);
  };

  const handleEmojiSelect = emoji => {
    text(emoji)
  };

  return (
    <View style={{ flex: 1,}}>
        <ScrollView  horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'center',height:50,  }}>
        {Object.keys(emojiData).map(category => (
          <TouchableOpacity key={category} onPress={() => handleCategoryChange(category)} style={{ padding: 10 }}>
            <Text style={{ fontFamily: category === selectedCategory ? BOLD : MEDIUM,fontSize:FontSize.FS_12,color:black,lineHeight:24 }}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </ScrollView>
      <FlatList
        data={emojiData[selectedCategory]}
        numColumns={6}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEmojiSelect(item.char)} style={{ padding: 10,backgroundColor:white,flex:1 ,alignItems:"center",justifyContent:"center"}}>
            <Text style={{ fontSize: 20,color:white }}>{item.char}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default EmojiPicker;
