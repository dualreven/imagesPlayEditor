use std::collections::HashSet;

use crate::domain::annotation::Annotation;
use crate::domain::timeline::{SystemAction, TimelineStep};

#[derive(Default)]
pub struct ExportContext {
    pub locked_ids: HashSet<String>,
}

pub fn build_frames(steps: &[TimelineStep], context: &ExportContext) -> Vec<Vec<Annotation>> {
    let mut frames: Vec<Vec<Annotation>> = Vec::new();
    let mut current: Vec<Annotation> = Vec::new();
    let mut keep_next = false;

    for (index, step) in steps.iter().enumerate() {
        match step {
            TimelineStep::Annotation { annotation } => {
                if keep_next {
                    current = vec![annotation.clone()];
                    keep_next = false;
                } else {
                    current.push(annotation.clone());
                }
                frames.push(current.clone());
            }
            TimelineStep::System { action } => match action {
                SystemAction::ClearPrevious => {
                    current.retain(|item| context.locked_ids.contains(&item.id));
                    if !steps[index + 1..]
                        .iter()
                        .any(|next| matches!(next, TimelineStep::Annotation { .. }))
                    {
                        frames.push(current.clone());
                    }
                }
                SystemAction::KeepNext => {
                    keep_next = true;
                }
            },
        }
    }

    frames
}

#[cfg(test)]
mod tests {
    use std::collections::HashSet;

    use crate::domain::annotation::{Annotation, AnnotationKind, AnnotationStyle, Point, Size};
    use crate::domain::exporter::{build_frames, ExportContext};
    use crate::domain::timeline::{SystemAction, TimelineStep};

    fn mock_annotation(id: &str) -> Annotation {
        Annotation {
            id: id.to_string(),
            kind: AnnotationKind::Box,
            position: Point { x: 1.0, y: 1.0 },
            size: Size {
                width: 2.0,
                height: 3.0,
            },
            text: None,
            locked: false,
            style: AnnotationStyle {
                color: "#fff".to_string(),
                stroke_width: 1.0,
                font_size: 12,
                arrow_length: 10.0,
            },
        }
    }

    #[test]
    fn clear_previous_keeps_locked_annotations() {
        let a1 = mock_annotation("a1");
        let a2 = mock_annotation("a2");
        let steps = vec![
            TimelineStep::Annotation {
                annotation: a1.clone(),
            },
            TimelineStep::Annotation {
                annotation: a2.clone(),
            },
            TimelineStep::System {
                action: SystemAction::ClearPrevious,
            },
        ];

        let locked_ids = HashSet::from([a1.id.clone()]);
        let context = ExportContext { locked_ids };
        let frames = build_frames(&steps, &context);

        assert_eq!(frames.len(), 3);
        assert_eq!(frames[2], vec![a1]);
    }

    #[test]
    fn clear_before_next_annotation_does_not_emit_blank_frame() {
        let a1 = mock_annotation("a1");
        let a2 = mock_annotation("a2");
        let steps = vec![
            TimelineStep::Annotation {
                annotation: a1.clone(),
            },
            TimelineStep::System {
                action: SystemAction::ClearPrevious,
            },
            TimelineStep::Annotation {
                annotation: a2.clone(),
            },
        ];

        let context = ExportContext::default();
        let frames = build_frames(&steps, &context);

        assert_eq!(frames.len(), 2);
        assert_eq!(frames[0], vec![a1]);
        assert_eq!(frames[1], vec![a2]);
    }
}
