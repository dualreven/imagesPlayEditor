use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize, Eq, PartialEq)]
pub enum AnnotationKind {
    Box,
    Arrow,
    Text,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct AnnotationStyle {
    pub color: String,
    pub stroke_width: f32,
    pub font_size: u16,
    pub arrow_length: f32,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Point {
    pub x: f32,
    pub y: f32,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Size {
    pub width: f32,
    pub height: f32,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Annotation {
    pub id: String,
    pub kind: AnnotationKind,
    pub position: Point,
    pub size: Size,
    pub text: Option<String>,
    pub locked: bool,
    pub style: AnnotationStyle,
}
