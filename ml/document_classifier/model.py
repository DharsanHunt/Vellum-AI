"""
Document Type Classification Model.
Classifies visual documents into:
0: ACADEMIC_CERTIFICATE
1: TRANSCRIPT
2: RECOMMENDATION_LETTER
3: ID_PASSPORT
4: INTERNSHIP_CERTIFICATE
"""

import torch
import torch.nn as nn
import torch.nn.functional as F

DOCUMENT_CLASSES = [
    "ACADEMIC_CERTIFICATE",
    "TRANSCRIPT",
    "RECOMMENDATION_LETTER",
    "ID_PASSPORT",
    "INTERNSHIP_CERTIFICATE"
]


class DocumentClassifier(nn.Module):
    def __init__(self, num_classes: int = 5):
        super(DocumentClassifier, self).__init__()
        # Efficient lightweight convolutional backbone
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, stride=2, padding=1)
        self.bn1 = nn.BatchNorm2d(32)
        
        self.conv2 = nn.Conv2d(32, 64, kernel_size=3, stride=2, padding=1)
        self.bn2 = nn.BatchNorm2d(64)
        
        self.conv3 = nn.Conv2d(64, 128, kernel_size=3, stride=2, padding=1)
        self.bn3 = nn.BatchNorm2d(128)
        
        self.conv4 = nn.Conv2d(128, 256, kernel_size=3, stride=2, padding=1)
        self.bn4 = nn.BatchNorm2d(256)

        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        
        # Document layout embedding feature head
        self.fc_embed = nn.Linear(256, 128)
        self.dropout = nn.Dropout(0.3)
        self.fc_classifier = nn.Linear(128, num_classes)

    def extract_features(self, x: torch.Tensor) -> torch.Tensor:
        """Extracts 128-dimensional document layout embedding."""
        x = F.relu(self.bn1(self.conv1(x)))
        x = F.relu(self.bn2(self.conv2(x)))
        x = F.relu(self.bn3(self.conv3(x)))
        x = F.relu(self.bn4(self.conv4(x)))
        x = self.pool(x)
        x = torch.flatten(x, 1)
        embed = F.relu(self.fc_embed(x))
        return embed

    def forward(self, x: torch.Tensor):
        embed = self.extract_features(x)
        dropped = self.dropout(embed)
        logits = self.fc_classifier(dropped)
        return logits, embed
