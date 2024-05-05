# app.py
from flask import Flask, request, jsonify
import pickle
import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the pre-trained model
loaded_model = pickle.load(open('./models/biomedical_ner_model.sav', 'rb'))
tokenizer = AutoTokenizer.from_pretrained("d4data/biomedical-ner-all")


@app.route('/receptionist', methods=['GET'])
def predict():
    try:
        text = request.args.get('text')
        inputs = tokenizer(text, return_tensors="pt",
                           padding=True, truncation=True)
        with torch.no_grad():
            outputs = loaded_model(**inputs)
        logits = outputs.logits
        predicted_class_indices = logits.argmax(dim=-1)
        predicted_labels = [loaded_model.config.id2label[i]
                            for i in predicted_class_indices[0].tolist()]

        # Tokenize the text while preserving word boundaries
        tokenized_inputs = tokenizer(text, return_offsets_mapping=True)
        tokens = tokenized_inputs.tokens()
        offset_mapping = tokenized_inputs["offset_mapping"]

        relevant_tags = []
        current_entity = ""
        current_tag = ""
        for idx, (mapping, ner_tag) in enumerate(zip(offset_mapping, predicted_labels)):
            word = text[mapping[0]:mapping[1]]
            if ner_tag.startswith("B-"):
                if current_entity:
                    relevant_tags.append(
                        {"entity": current_entity, "tag": current_tag[2:]})
                current_entity = word
                current_tag = ner_tag
            elif ner_tag.startswith("I-") and current_entity:
                current_entity += " " + word
            else:
                if current_entity:
                    relevant_tags.append(
                        {"entity": current_entity, "tag": current_tag[2:]})
                current_entity = ""
                current_tag = ""

        if current_entity:
            relevant_tags.append(
                {"entity": current_entity, "tag": current_tag[2:]})

        response = {"predictions": relevant_tags}
        print(response)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
