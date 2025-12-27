import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { CrisisEpisode } from '../types/healthLog';

interface CrisisLogModalProps {
  visible: boolean;
  onClose: () => void;
  onSave?: (episode: CrisisEpisode) => void;
}

export default function CrisisLogModal({ visible, onClose, onSave }: CrisisLogModalProps) {
  const [painLevel, setPainLevel] = useState(8);
  const [selectedTriggers, setSelectedTriggers] = useState(['Cold Weather']);
  const [expandedMetrics, setExpandedMetrics] = useState(false);

  const getPainColor = (level: number) => {
    if (level <= 3) return '#10B981'; // green
    if (level <= 6) return '#F59E0B'; // amber
    return '#EF4444'; // red
  };

  const toggleTrigger = (trigger: string) => {
    if (selectedTriggers.includes(trigger)) {
      setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
    } else {
      setSelectedTriggers([...selectedTriggers, trigger]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-gray-50">
        {/* Clean Professional Header */}
        <View className="bg-white px-6 pt-6 pb-4 border-b border-gray-100 flex-row items-center justify-between">
          <View>
            <Text className="text-brand-muted text-brand-section mb-1">Incident Report</Text>
            <Text className="text-brand-title text-brand-dark">Crisis Log</Text>
          </View>
          <Pressable
            onPress={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center border border-gray-200 active:bg-gray-200"
          >
            <MaterialIcons name="close" size={20} color="#374151" />
          </Pressable>
        </View>

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-6 pt-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, gap: 20 }}
        >
          {/* Internal Progress Info */}
          <View className="flex-row items-start bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <MaterialIcons name="info-outline" size={20} color="#3b82f6" style={{ marginTop: 2 }} />
            <Text className="text-blue-700 text-sm font-medium ml-3 flex-1 leading-5">
              This log helps your care team understand your crisis patterns and triggers.
            </Text>
          </View>

          {/* Pain Dial Card */}
          <View className="bg-white rounded-[32px] p-6 items-center shadow-sm border border-gray-200">
            <View className="items-center mb-6">
              <Text className="text-brand-muted text-brand-section mb-1">Severity Assessment</Text>
              <Text className="text-brand-label text-brand-dark text-lg uppercase tracking-tight">Current Pain Level</Text>
            </View>

            {/* Pain Dial */}
            <View className="relative items-center justify-center w-48 h-48 rounded-full bg-gray-50 border-4 border-gray-100 shadow-inner">
              <View className="items-center">
                <Text className="text-6xl font-black" style={{ color: getPainColor(painLevel) }}>
                  {painLevel}
                </Text>
                <Text className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">/ 10</Text>
              </View>
            </View>

            {/* Slider container */}
            <View className="w-full mt-8 px-2">
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={1}
                maximumValue={10}
                step={1}
                value={painLevel}
                onValueChange={setPainLevel}
                minimumTrackTintColor={getPainColor(painLevel)}
                maximumTrackTintColor="#f3f4f6"
                thumbTintColor={getPainColor(painLevel)}
              />
              <View className="flex-row justify-between px-1 mt-1">
                <Text className="text-gray-400 font-bold text-[10px] uppercase">Mild</Text>
                <Text className="text-gray-400 font-bold text-[10px] uppercase">Severe</Text>
              </View>
            </View>
          </View>

          {/* Active Triggers */}
          <View className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-200">
            <View className="flex-row items-center gap-2 mb-4">
              <MaterialIcons name="bolt" size={24} color="#EF4444" />
              <Text className="text-brand-label text-brand-dark text-lg">Potential Triggers</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {['Cold Weather', 'Dehydration', 'Stress', 'Exertion', 'Altitude', 'Other'].map((trigger) => {
                const isSelected = selectedTriggers.includes(trigger);
                return (
                  <Pressable
                    key={trigger}
                    onPress={() => toggleTrigger(trigger)}
                    className={`px-4 py-2.5 rounded-xl border ${isSelected
                      ? 'bg-gray-900 border-gray-900'
                      : 'bg-white border-gray-200'
                      } shadow-sm active:scale-95 transition-transform`}
                  >
                    <Text
                      className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-600'
                        }`}
                    >
                      {trigger}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Action Button */}
          <Pressable
            style={{ backgroundColor: '#EF4444' }}
            className="w-full py-4 rounded-3xl shadow-lg flex-row items-center justify-center gap-3 active:opacity-90 mt-4 mb-8"
            onPress={() => {
              if (onSave) {
                const episode: CrisisEpisode = {
                  id: Date.now().toString(),
                  painLevel,
                  startTime: new Date().toISOString(),
                  triggers: selectedTriggers,
                  timestamp: new Date().toISOString(),
                };
                onSave(episode);
              }
              // Reset state for next use
              setPainLevel(8);
              setSelectedTriggers(['Cold Weather']);
              onClose();
            }}
          >
            <MaterialIcons name="check" size={20} color="#ffffff" />
            <Text className="text-white text-brand-button">Submit Crisis Report</Text>
          </Pressable>

        </ScrollView>
      </View>
    </Modal>
  );
}
