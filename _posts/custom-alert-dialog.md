---
categories:
  - dev
date: "2023-01-25"
description: "mui를 참고하여 커스텀 Alert과 Confirm을 만들어보자"
tags:
  - react
  - typescript
  - components
title: mui를 참고하여 커스텀 Alert, Confirm 만들기
public: true
---
# mui AlertDialog

## 사용 예시
> [mui docs](https://mui.com/material-ui/react-dialog/#alerts)에서 제공하는 예시이다.
```javascript
export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle>
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Let Google help apps determine location. This means sending anonymous
            location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
```
## 구성요소

### Backdrop
- Dialog 외부의 backdrop component이다.
- 해당 component를 클릭하면 onClose가 호출된다.
### Dialog
- Dialog를 구성하는 wrapper component이다.
- 전체적인 transition과 backdrop component, onClose, open, onClick, context api를 활용하여 titleId를 내려주고 있다. 이는 `aria-labelledby="alert-dialog-title"`이다
```javascript
  const ariaLabelledby = useId(ariaLabelledbyProp);
  const dialogContextValue = React.useMemo(() => {
    return { titleId: ariaLabelledby };
  }, [ariaLabelledby]);

  return (
    <DialogRoot
      components={{ Backdrop: DialogBackdrop }}
      onClose={onClose}
      open={open}
      ref={ref}
      onClick={handleBackdropClick}
    >
    <TransitionComponent>
        <DialogContainer
          onMouseDown={handleMouseDown}
        >
          <DialogPaper>
            <DialogContext.Provider value={dialogContextValue}>{children}</DialogContext.Provider>
          </DialogPaper>
        </DialogContainer>
      </TransitionComponent>
    </DialogRoot>
  );
```
### DialogTitle
- Dialog의 Title을 보여주는 것을 담당한다.
```javascript
  const { titleId: id = idProp } = React.useContext(DialogContext);

  return (
    <DialogTitleRoot
      component="h2"
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      variant="h6"
      id={id}
      {...other}
    />
  );
```
### DialogContent
- Dialog의 Content를 보여주는 것을 담당한다.
```javascript
  return (
    <DialogContentRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
```
### DialogContentText
- Dialog의 Content아래의 text를 보여주는 것을 담당한다.
```javascript
  return (
    <DialogContentTextRoot
      component="p"
      variant="body1"
      color="text.secondary"
      ref={ref}
      ownerState={ownerState}
      className={clsx(classes.root, className)}
      {...props}
      classes={classes}
    />
  );
```
### DialogActions
- Dialog의 Actions를 담당한다.
- 취소, 확인, 거부, 동의, 저장, 수정 등의 Actions의 wrapper component
```javascript
  return (
    <DialogActionsRoot
      className={clsx(classes.root, className)}
      ownerState={ownerState}
      ref={ref}
      {...other}
    />
  );
```
# 커스텀 Dialog

## 컴포넌트 설계
- Alert과 Confirm은 넓은 의미로 Dialog로 볼 수 있다.
- Alert은 알림과 같은 확인 등의 text, content를 보여주고 onClose의 action만 담당한다.
- Confirm은 어떠한 action을 수행하기 전, 확인을 받기 위해 text, content를 보여주고 동의, 거부와 같은 actions를 담당한다.
- 따라서, Dialog, DialogTitle, DialogContent, DialogActions를 구현하고 컴포넌트의 역할을 명확히 하기 위해 Alert, Confirm에서 Dialog를 가져와 컴포넌트를 각각 만든다.

## 구성요소
### Dialog
- open, onClose를 props으로 받는다.
- backdrop을 내부에서 관리한다.

### DialogTitle
- title text를 children으로 받아 렌더링한다.

### DialogContent
- content를 children으로 받아 렌더링한다.

### DialogActions
- action을 발생하는 children을 받아 렌더링한다.