import { useState } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";
import { createPost } from "../services/api";

const CreatePostScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permissão negada",
        text2: "É necessário permitir o acesso à galeria de fotos.",
      });
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Toast.show({
        type: "success",
        text1: "Imagem selecionada",
        text2: "Sua imagem foi adicionada com sucesso!",
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permissão negada",
        "É necessário permitir o acesso à câmera."
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Toast.show({
        type: "success",
        text1: "Foto capturada",
        text2: "Sua foto foi adicionada com sucesso!",
      });
    }
  };

  const handleCreatePost = async () => {
    if (!title || !content || !image) {
      Toast.show({
        type: "error",
        text1: "Campos obrigatórios",
        text2: "Preencha todos os campos e selecione uma imagem.",
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      const filename = image.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("foto", {
        uri: Platform.OS === "ios" ? image.replace("file://", "") : image,
        name: filename,
        type,
      });

      console.log("FormData criado:", formData);

      await createPost(formData);

      Toast.show({
        type: "success",
        text1: "Post criado!",
        text2: "Seu post foi publicado com sucesso!",
      });

      setTitle("");
      setContent("");
      setImage(null);

      // Aguardar um pouco para mostrar o toast antes de navegar
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (e) {
      console.log("Erro detalhado:", e?.response?.data, e?.message, e);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        "Erro ao criar post";

      Toast.show({
        type: "error",
        text1: "Erro ao criar post",
        text2: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Ionicons name="create-outline" size={28} color="#f59e0b" />
            <Text style={styles.title}>Criar novo post</Text>
          </View>
          <Text style={styles.subtitle}>
            Compartilhe suas ideias com o mundo
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              placeholder="Digite o título do seu post"
              placeholderTextColor="#6b7280"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Conteúdo</Text>
            <TextInput
              placeholder="Conte sua história..."
              placeholderTextColor="#6b7280"
              value={content}
              onChangeText={setContent}
              style={[styles.input, styles.textArea]}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.imageSection}>
            <Text style={styles.label}>Imagem</Text>
            <View style={styles.imageButtons}>
              <TouchableOpacity
                onPress={pickImage}
                style={[styles.imageButton, styles.galleryButton]}
              >
                <Ionicons name="images-outline" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Galeria</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={takePhoto}
                style={[styles.imageButton, styles.cameraButton]}
              >
                <Ionicons name="camera-outline" size={24} color="#ffffff" />
                <Text style={styles.buttonText}>Câmera</Text>
              </TouchableOpacity>
            </View>

            {image && (
              <View style={styles.imagePreview}>
                <Image
                  source={{ uri: image }}
                  style={styles.previewImage}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImage(null)}
                >
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={handleCreatePost}
            disabled={loading}
            style={[styles.createButton, loading && styles.disabledButton]}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-outline" size={20} color="#ffffff" />
                <Text style={styles.createButtonText}>Criar Post</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
          >
            <Ionicons name="arrow-back-outline" size={20} color="#9ca3af" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginLeft: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af",
    marginLeft: 40,
  },
  formContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    minHeight: 50,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  imageSection: {
    marginBottom: 32,
  },
  imageButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  galleryButton: {
    backgroundColor: "#3b82f6",
  },
  cameraButton: {
    backgroundColor: "#10b981",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  imagePreview: {
    position: "relative",
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#1a1a1a",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
  },
  createButton: {
    backgroundColor: "#f59e0b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: "#6b7280",
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#333333",
  },
  cancelButtonText: {
    color: "#9ca3af",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default CreatePostScreen;
